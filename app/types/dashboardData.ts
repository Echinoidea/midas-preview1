/**
 * Interface to represent the risk percentages of each risk score.
 * Low, Some, and High. Should add up to 1.0
 *
 * TODO: Bug - sometimes its possible for float math to result in slightly above 1.0
 * which scales the graphs weirdly
 */
interface RiskPercentage {
  low: number;
  some: number;
  high: number;
}

/**
 * Similar to the RiskPercentage interface, but for stats that require a discrete
 * representation of occurrances.
 */
interface OccurancePercentage {
  zero: number;
  oneplus: number;
}

/**
 * Global interface for storing the data required to be displayed on the dashboard.
 * For school, grade, and classroom dashboards
 */
interface DashboardData {
  midasRiskPercentages: RiskPercentage;
  teacherRiskPercentages: RiskPercentage;
  studentRiskPercentages: RiskPercentage;

  midasConfidence: string | null;

  odrPercentages: OccurancePercentage;
  suspPercentages: OccurancePercentage;

  mathPercentages: RiskPercentage;
  readPercentages: RiskPercentage;

  ethnicityRiskPercentages: {
    white: RiskPercentage;
    hispanic: RiskPercentage;
    other: RiskPercentage;
  };
  ellRiskPercentages: {
    ell: RiskPercentage;
    nonEll: RiskPercentage;
  };
  genderRiskPercentages: {
    male: RiskPercentage;
    female: RiskPercentage;
  };
}

/**
 * Global interface for storing the data required to be displayed on the dashboard.
 * Specifically for the student dashboard as it is only one record instead of a set.
 */
interface StudentDashboardData {
  midasRiskLabel: string;
  teacherRiskLabel: string;
  studentRiskLabel: string;

  midasConfidence: string;

  odrLabel: string;
  suspLabel: string;

  mathLabel: string;
  readLabel: string;

  ethnicity: string;
  ell: string;
  gender: string;
}
