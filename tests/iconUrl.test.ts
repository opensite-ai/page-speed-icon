import {
  buildIconRequestUrl,
  parseIconName
} from "../src/utils/iconUrl";

describe("iconUrl utilities", () => {
  it("parses slash-delimited icon names", () => {
    expect(parseIconName("lucide/home")).toEqual({
      prefix: "lucide",
      iconName: "home"
    });
  });

  it("parses colon-delimited icon names", () => {
    expect(parseIconName("mdi:account")).toEqual({
      prefix: "mdi",
      iconName: "account"
    });
  });

  it("returns null for invalid icon names", () => {
    expect(parseIconName("lucide")).toBeNull();
    expect(parseIconName("/home")).toBeNull();
    expect(parseIconName(":account")).toBeNull();
  });

  it("builds expected url with key and dimensions", () => {
    const url = buildIconRequestUrl({
      name: "lucide/home",
      size: 24,
      apiKey: "secret",
      baseUrl: "https://icons.opensite.ai"
    });

    expect(url).toBe(
      "https://icons.opensite.ai/api/icon/lucide/home?format=svg&width=24&height=24&key=secret"
    );
  });

  it("throws when api key is missing", () => {
    expect(() =>
      buildIconRequestUrl({
        name: "lucide/home",
        size: 24,
        apiKey: ""
      })
    ).toThrow("apiKey");
  });
});
