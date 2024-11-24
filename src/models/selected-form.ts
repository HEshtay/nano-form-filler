export interface SelectedFormInput {
    type: string;
    label: string;
    placeholder: string;
    values: string[];
}

export type SelectedForm = Map<string, SelectedFormInput>;
