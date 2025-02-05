import { OuterClasses } from '#types/basicTypes';
import { InputControlClassName } from '#ui/InputControl';

export type InputClasses = OuterClasses<
  InputControlClassName | 'inputContainer' | 'input' | 'prefix' | 'suffix'
>;
