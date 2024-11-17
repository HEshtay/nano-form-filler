export function getSelectedFormIndex() {
    const select: HTMLSelectElement | null = document.getElementById(
        "selectedFormInput",
    ) as HTMLSelectElement | null;
    if (select == null) return -1;
    return parseInt(select.value, 10);
}
