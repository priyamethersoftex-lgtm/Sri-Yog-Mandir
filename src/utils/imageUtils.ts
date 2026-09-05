/**
 * imageUtils.ts
 * Core utility for managing cloud-hosted images with variants.
 */

/**
 * Constructs a the full image URL from a key and settings.
 * @param {string} key - The unique image identifier (e.g. from ProductImageLink)
 * @param {Object} settings - Configuration object containing CloudDeliveryURL, etc.
 * @param {string} variant - The variant suffix (original, thumb, etc.)
 * @returns {string} - The complete URL
 */
export const getCloudImgUrl = (key: string | null | undefined, settings: any = {}, variant = ""): string | null => {
    if (!key) return null;
    // Default fallback values if settings are not loaded yet
    const baseUrl = settings.CloudDeliveryURL || "";
    const suffix = variant || settings.CloudVariantOriginal || "";

    if (key.startsWith('http')) return key;

    // Construction: URL + KEY + VARIANT
    return `${baseUrl}${key}${suffix}`;
};
