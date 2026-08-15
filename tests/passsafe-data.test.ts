import { describe, expect, it } from "vitest";

import { filteredQuestions, getLocalizedQuestion, getQuestionTopics, questionBank } from "@/lib/passsafe-data";
import { getSession, startSession } from "@/lib/session-store";

describe("PassSafe question bank", () => {
  it("includes the supplied 1,000-question multilingual dataset", () => {
    expect(questionBank).toHaveLength(1000);
    expect(questionBank[0].language.en.question).toBeTruthy();
    expect(questionBank[0].language.es.question).toBeTruthy();
    expect(questionBank[0].language.zh.question).toBeTruthy();
    expect(questionBank[0].language.ko.question).toBeTruthy();
  });

  it("selects localized content with the expected answer metadata", () => {
    const question = questionBank[0];
    const localized = getLocalizedQuestion(question, "zh");
    expect(localized.options).toHaveLength(4);
    expect(localized.correctIndex).toBeGreaterThanOrEqual(0);
    expect(localized.correctIndex).toBeLessThan(localized.options.length);
  });

  it("filters question pools and reports topic totals for the selected certification", () => {
    expect(filteredQuestions("manager").length).toBeGreaterThan(0);
    expect(getQuestionTopics("handler").reduce((total, item) => total + item.count, 0)).toBe(filteredQuestions("handler").length);
  });
});

describe("PassSafe study sessions", () => {
  it("creates a retrievable practice set with the correct quick-practice size", () => {
    const session = startSession("quick", "manager");
    expect(session.questions).toHaveLength(10);
    expect(getSession(session.id)).toEqual(session);
  });
});
