export const firstString = (v: unknown): string | undefined => {
    if (typeof v === "string") return v;
    if (Array.isArray(v) && typeof v[0] === "string") return v[0];
    return undefined;
};

export const requiredString = (v: unknown, field = "value"): string => {
    const s = firstString(v);
    if (!s) throw new Error(`Missing/invalid ${field}`);
    return s;
};

// Deprecated alias if needed, but we will migrate usages.
export const getString = firstString;
