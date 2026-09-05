/**
 * Utility function to fetch the user's public IP address.
 * Uses ipify API to get the IP in JSON format.
 * @returns {Promise<string>} The public IP address or "127.0.0.1" as fallback.
 */
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "127.0.0.1";
  } catch (error) {
    console.error("Error fetching system IP:", error);
    return "127.0.0.1";
  }
};