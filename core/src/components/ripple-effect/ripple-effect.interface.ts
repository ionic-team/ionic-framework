export type IonRippleEffectRecipe = {
  opacity?: string;
};

export const ION_RIPPLE_EFFECT_TYPES = ['bounded', 'unbounded'] as const;
export type IonRippleEffectType = (typeof ION_RIPPLE_EFFECT_TYPES)[number];
