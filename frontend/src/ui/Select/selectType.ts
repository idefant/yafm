import { OuterClasses } from '#types/basicTypes';
import { InputControlClassName } from '#ui/InputControl';

export type SelectClasses = OuterClasses<InputControlClassName>;

export type SelectOption = { value: string; label: string };
