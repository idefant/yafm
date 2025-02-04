import { OuterClasses } from '#types/basicTypes';
import { InputControlClassName } from '#ui/InputControl';

export type TextInputClasses = OuterClasses<
  InputControlClassName | 'inputContainer' | 'input' | 'prefix' | 'suffix'
>;
