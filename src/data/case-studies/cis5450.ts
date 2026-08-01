import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * CIS 5450: Lending Club default risk.
 * Source of truth: cis5450finalproject.ipynb (Kaggle Lending Club).
 * Do not invent metrics beyond notebook-reported AUC progression.
 */
export const CIS5450_CASE_STUDY: EngineeringCaseStudy = {
  slug: "cis5450-loan-default",
  motivation: {
    why: "I wanted a tabular ML project where the scary part was not the model library. Leakage and bad metrics can make you look smart while being wrong.",
    interest:
      "XGBoost is not the story. Keeping recoveries and total_pymnt out of the feature set is. Same for fitting transforms only after the split.",
    learning:
      "CIS 5450 was practice owning the whole notebook path: cleaning, EDA, honest split, model ladder, and threshold thinking that is not just accuracy.",
  },
  systemOverview: {
    summary:
      "Lending Club loans from roughly 2007 to 2018. Predict charged-off vs paid. Drop leakage, explore the class balance, split, then fit everything on train only. Models go from logistic regression up to tuned XGBoost around 0.7175 AUC.",
    subsystems: [
      {
        name: "Label & leakage control",
        role: "Keep only definitive outcomes; remove post-default fields such as recoveries and total_pymnt.",
      },
      {
        name: "EDA → feature design",
        role: "Plots and tests motivate which affordability and risk signals enter the model.",
      },
      {
        name: "Leakage-safe preprocessing",
        role: "Split first; fit frequency encoding, impute, winsorize, K-Means, and scale on train only.",
      },
      {
        name: "Model ladder",
        role: "LR, ElasticNet, tree, RF, XGBoost; compare with AUC-ROC and PR thinking.",
      },
      {
        name: "Decision analysis",
        role: "Threshold sweeps translate probabilities into asymmetric FN/FP cost tradeoffs.",
      },
    ],
    dataFlow:
      "Raw loan.csv → outcome filter + leakage drop → EDA → stratified 80/20 split → train-fitted transforms → models → AUC/PR + cost simulation.",
    controlFlow:
      "No transform is fitted before the split. SMOTE touches train only. Test remains naturally imbalanced so reported AUC reflects realistic ranking.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/cis5450-cover.svg",
      alt: "CIS 5450 loan default risk cover",
      label: "Project cover",
      caption: "Cover card for the pipeline: kill leakage, split first, then model.",
    },
  },
  disciplines: [
    {
      id: "data-contract",
      discipline: "Data Contract & Leakage Control",
      goal: "Define a prediction-time feature set that a lender could have known at origination.",
      design:
        "Filter to paid vs charged-off. Drop high-missingness columns. Remove identifiers and post-outcome fields (recoveries, total_pymnt). Keep borrower credit history, loan terms, and categorical descriptors that exist before final outcome.",
      challenges: [
        "Several 'strong' columns are cheat codes recorded after default.",
        "Current/late loans would inject label noise if kept.",
        "Grade and interest rate are valid yet partly encode prior underwriting; that must be stated, not hidden.",
      ],
      iterations: [
        "Broad column dump.",
        "Missingness cull.",
        "Explicit leakage audit before modeling.",
      ],
      finalImplementation:
        "A compact, origination-plausible feature matrix with leakage columns removed before any model sees the data.",
    },
    {
      id: "eda-features",
      discipline: "EDA & Feature Engineering",
      goal: "Let distributional evidence decide which features and interactions deserve model capacity.",
      design:
        "Class balance, KDEs, outliers, correlations, and default rate by grade each map to a downstream choice: SMOTE/class weight, winsorization, regularization/ensembles, and engineered affordability features such as payment_to_income and dti_int_interaction. Hypothesis tests back DTI, interest rate, and revolving utilization differences.",
      challenges: [
        "Accuracy is a trap under ~80/20 imbalance.",
        "Skewed income and balances dominate naive distance methods without train-only winsorization.",
        "Weak standalone separators can still help in combination.",
      ],
      iterations: [
        "Raw EDA on lightly cleaned frames.",
        "Engineered affordability/risk interactions after plots.",
        "Train-only frequency encoding for employment titles.",
      ],
      finalImplementation:
        "An EDA-motivated feature set plus statistical tests that justify the strongest numeric risk signals.",
    },
    {
      id: "modeling",
      discipline: "Modeling & Validation",
      goal: "Compare linear and tree ensembles on held-out ranking performance without leaking fit statistics.",
      design:
        "Stratified split; train-only preprocess; SMOTE for linear models; class weighting / scale_pos_weight for trees. Ladder: unregularized-style LR baseline, ElasticNet, decision tree, random forest, XGBoost, then light tuning. Feature-importance pruning used as a parsimony diagnostic. Threshold and cost sweeps show why 0.5 is not a business policy.",
      challenges: [
        "Linear models plateau near ~0.706 AUC; gains come from capacity and features, not more L2 alone.",
        "Tuned XGBoost reaches about 0.7175 AUC with only a marginal lift over default XGBoost (~0.7167), suggesting a signal ceiling.",
        "Cost-optimal thresholds on the test set are illustrative; production needs a validation-set policy.",
      ],
      iterations: [
        "Baseline logistic regression.",
        "Regularized linear and single tree.",
        "Bagging and boosting.",
        "Threshold / cost simulation after selecting the best ranker.",
      ],
      finalImplementation:
        "Tuned XGBoost retained as the primary ranker, with LR coefficients and RF importances agreeing on interest rate, grade structure, DTI, and revolving utilization as core signals.",
      media: {
        kind: "image",
        src: "/projects/gallery/cis5450-pipeline.svg",
        alt: "Model ladder and leakage-safe pipeline summary",
        label: "Model ladder",
        caption: "AUC progression and leakage-safe preprocessing summarized for review.",
      },
    },
  ],
  designDecisions: [
    {
      id: "auc-not-acc",
      title: "AUC-ROC and PR over accuracy",
      problem: "Which metrics match the business question under imbalance?",
      alternatives: ["Accuracy", "AUC-ROC + PR/F1 family"],
      tradeoffs:
        "Accuracy rewards predicting paid. Ranking and PR expose default capture.",
      choice: "AUC-ROC for model comparison; PR and threshold analysis for decisions.",
    },
    {
      id: "split-first",
      title: "Split before fitting transforms",
      problem: "When may imputation, winsorization, encoding, and clustering see the data?",
      alternatives: ["Fit on full data then split", "Split then train-only fits"],
      tradeoffs:
        "Full-data fits quietly leak distributional information into test.",
      choice: "Stratified split first; every fitted statistic is train-only.",
    },
    {
      id: "smote-scope",
      title: "SMOTE only for linear training",
      problem: "How should class imbalance be handled across model families?",
      alternatives: ["SMOTE everywhere", "Class weights only", "SMOTE for linear; weights for trees"],
      tradeoffs:
        "SMOTE on trees can distort leaf statistics; linear models benefit more from balanced gradients.",
      choice: "SMOTE for LR/ElasticNet train sets; trees use weighting mechanisms; test never resampled.",
    },
    {
      id: "threshold",
      title: "Treat 0.5 as non-sacred",
      problem: "How should probabilities become approve/deny?",
      alternatives: ["Fixed 0.5", "PR-informed threshold", "Cost simulation"],
      tradeoffs:
        "Fixed 0.5 ignores asymmetric FN/FP dollars. Test-set sweeps are illustrative, not deployment gospel.",
      choice: "Show cost-aware threshold thinking; call out validation-set selection for real deployment.",
    },
  ],
  evolution: [
    {
      id: "c1",
      phase: "Stage 1",
      title: "Usable labels",
      description: "Definitive outcomes only; leakage columns removed.",
    },
    {
      id: "c2",
      phase: "Stage 2",
      title: "EDA-driven features",
      description: "Plots and tests decide what enters the matrix.",
    },
    {
      id: "c3",
      phase: "Stage 3",
      title: "Leakage-safe preprocess",
      description: "Split-first pipeline with train-only fits and SMOTE scope rules.",
    },
    {
      id: "c4",
      phase: "Stage 4",
      title: "Model ladder + decisions",
      description: "Ensembles, ~0.7175 AUC tuned XGBoost, PR/cost threshold analysis.",
    },
  ],
  results: {
    items: [
      {
        title: "Ranking performance",
        body: "Linear models ~0.706 AUC; default XGBoost ~0.7167; tuned XGBoost ~0.7175 on held-out test.",
        evidence: "Notebook model progression / CV vs test comparison",
      },
      {
        title: "Statistical grounding",
        body: "DTI, interest rate, and revolving utilization differ by default status with p < 0.0005 and positive bootstrap CIs.",
        evidence: "Hypothesis testing section",
      },
      {
        title: "Decision framing",
        body: "Cost simulation shows asymmetric FN/FP dollars can push an operating threshold away from 0.5 (illustrative test-set sweep).",
        evidence: "Threshold / cost-benefit section",
      },
    ],
    limitations: [
      "Course notebook analysis, not a deployed underwriting system.",
      "Grade and interest rate embed prior underwriting; fairness audits would be required for real use.",
      "Cost-optimal threshold reported from a test-set simulation should be re-selected on validation data before deployment.",
    ],
  },
  reflection: {
    surprises: [
      "Hyperparameter tuning barely moved AUC once features and leakage control were right.",
      "The most valuable engineering was column discipline, not model novelty.",
    ],
    redesign: [
      "Hold out a true validation split for threshold policy.",
      "Stronger fairness analysis on grade/rate proxies.",
    ],
    future: [
      "Calibration plots and profitability curves on a time-based split.",
      "Model monitoring story for drift in int_rate and utilization.",
    ],
    questions: [
      "How much of tabular 'ML gains' are actually leakage removal?",
      "When should unsupervised segments be features versus just EDA tools?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "If a feature is recorded after default, it is not a feature. It is a spoiler.",
    },
    {
      kind: "design-insight",
      text: "Fit nothing before the split if you want a number you can defend.",
    },
    {
      kind: "observation",
      text: "Recruiters remember leakage awareness and threshold thinking more than another boosting library name.",
    },
  ],
};
