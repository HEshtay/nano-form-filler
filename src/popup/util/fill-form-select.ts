export function fillFormSelect(labels: string[]): void {
    const select: HTMLSelectElement | null = document.getElementById(
        "selectedFormInput",
    ) as HTMLSelectElement | null;
    if (select == null) return;
    select.innerHTML = "";
    labels.forEach((label, index) => {
        const option = document.createElement("option");
        option.text = label.length !== 0 ? label : "Form " + index;
        option.value = index.toString();
        select.add(option);
    });
    if (labels.length === 0) {
        const option = document.createElement("option");
        option.text = "No Form found";
        option.value = "-1";
        select.add(option);
    }
}
