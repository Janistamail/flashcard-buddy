# Flashcard Buddy

A personal vocabulary-building tool: look up English words and sentences via AI, and save word entries as flashcards.

## Language

**Lever**:
The skeuomorphic toggle control on the home page that switches between Word mode and Sentence mode.
_Avoid_: Switch, toggle, radio dial

**Word mode**:
Lever position where the user enters a single English word or phrase and gets back its English meaning, Thai meaning, and 2 example sentences. Results can be saved as a Vocabulary entry.

**Sentence mode**:
Lever position where the user enters an English sentence and gets back its Thai translation only. Results are transient and never saved.

**Vocabulary**:
A saved flashcard entry: the English word, its English meaning (definition), its Thai meaning, and 2 example sentences. Owned by exactly one User and private to them. Created from Word mode, or in batches via Bulk Import.
_Avoid_: Word, entry, card

**Bulk Import**:
The action of saving many Vocabulary entries at once by pasting a JSON array into a modal, opened from the navbar's hamburger menu. Skips duplicates and invalid entries individually rather than rejecting the whole paste.
_Avoid_: Bulk add, add vocab JSON, JSON import

**User**:
A person signed in to the app via their Google account. Each User has their own private set of Vocabulary entries, invisible to other Users. Signing in is open to any Google account — there is no invite or allowlist step.
_Avoid_: Account, customer

**Play Session**:
A single pass through a chosen batch of Vocabulary cards during flashcard review, from the play button on the home page through to the "complete" screen. Ephemeral — held in server memory only, identified by a generated ID, and does not survive a server restart.
_Avoid_: Session (reserved for the signed-in User's login session, tracked by the auth system — a different concept)
