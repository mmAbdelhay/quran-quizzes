# Quran Memorization Quizzes — امتحانات ضبط حفظ القرآن

Interactive quizzes that test precise Quran memorization: which rub' (quarter) a verse is in, what verse comes next, and verbal similarities (mutashabihat) between verses.

Live site: served by GitHub Pages from the `main` branch.

## Structure

```
index.html              Home page — lists every quiz from assets/catalog.js
assets/quiz.css         Shared styles
assets/quiz.js          Shared quiz engine
assets/catalog.js       List of quizzes shown on the home page
quizzes/<id>/index.html Quiz page (same template for every quiz)
quizzes/<id>/questions.js  The quiz's questions
```

## Adding a new quiz

1. Copy `quizzes/juz-01/` to a new folder, e.g. `quizzes/juz-02/`.
2. Edit `questions.js`: set `title`, `subtitle`, and the `questions` list.
   Each question: `{ t: "category", q: "prompt", o: [correct, wrong, wrong, wrong], e: "explanation", h: "optional hint", plain: true for non-Quranic options }`.
   The first option is always the correct one; options are shuffled when shown.
3. Add a line for it in `assets/catalog.js`.
4. Commit and push — the site updates in about a minute.

> Verify all verse text against a mushaf before publishing.
