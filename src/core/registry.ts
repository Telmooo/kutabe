import type { Parser } from "../parsers/base";
import type { Renderer } from "../renderers/base";

export class LanguageRegistry {
  private static instance: LanguageRegistry;

  private readonly parsers = new Map<string, Parser>();
  private readonly renderers = new Map<string, Renderer>();

  private constructor() {}

  static getInstance(): LanguageRegistry {
    if (!LanguageRegistry.instance) {
      LanguageRegistry.instance = new LanguageRegistry();
    }
    return LanguageRegistry.instance;
  }

  registerParser(parser: Parser): void {
    for (const lang of parser.languages) {
      this.parsers.set(lang, parser);
    }
  }

  registerRenderer(languageId: string, renderer: Renderer): void {
    this.renderers.set(languageId, renderer);
  }

  getParser(languageId: string): Parser | undefined {
    return this.parsers.get(languageId);
  }

  getRenderer(languageId: string): Renderer | undefined {
    return this.renderers.get(languageId);
  }
}
