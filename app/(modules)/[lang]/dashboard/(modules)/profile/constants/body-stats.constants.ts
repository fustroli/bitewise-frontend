/** What a User may enter as Body stats; `step` is the input's precision. */
export const BODY_STATS_LIMITS = {
  heightCm: { min: 100, max: 250, step: 1 },
  weightKg: { min: 30, max: 300, step: 0.1 },
};

/** The ages the adult BMI table and calorie formulas apply to. */
export const AGE_LIMITS = { min: 18, max: 100 };

/** Anchors of Profile sections, for links from elsewhere. */
export const PROFILE_SECTION_IDS = {
  personalInformation: 'personal-information',
  bodyStats: 'body-stats',
};
