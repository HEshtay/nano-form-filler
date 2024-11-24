export function fillFormSelect(labels: string[]): void {
    const select: HTMLSelectElement | null = document.getElementById(
        "selectedFormInput",
    ) as HTMLSelectElement | null;
    if (select == null) return;
    select.innerHTML = "";
    labels.forEach((label, index) => {
        const option = document.createElement("option");
        option.text = label;
        option.value = index.toString();
        select.add(option);
    });
}
