// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomElement = { type: string; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type BulletedListElement = {
  type: 'bulleted-list';
  align?: string;
  children: Descendant[];
};
