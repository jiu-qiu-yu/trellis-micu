# Update README Image Display

## Goal

Update the student-facing README so students see the Hook trust screenshots directly and understand they should download the lesson HTML before reading it.

## Requirements

* Change the first-use guidance from "学生第一次打开时，优先阅读根目录里的教学页面：" to "第一次打开时，优先阅读根目录里的教学页面HTML先下载后阅读：".
* Display `1.png`, `2.png`, and `3.png` inline in `README.md` instead of only linking to them.
* Keep the README concise and student-facing.

## Acceptance Criteria

* [x] `README.md` contains the updated HTML download-first sentence.
* [x] `README.md` renders `1.png`, `2.png`, and `3.png` inline.
* [x] Existing guidance that `教案.html` is the main material remains intact.

## Definition of Done

* README content is updated.
* Git status is reviewed after changes.

## Technical Approach

Use standard Markdown image syntax for the three existing root images.

## Out of Scope

* Editing `教案.html`.
* Editing image files.
* Changing source code under `Trellis/`.

## Technical Notes

* User requested a README-only update.
