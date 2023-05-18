import { TextFileView } from "obsidian";

export const VIEW_TYPE_CSV = "csv-view";

//NOTE: this CSV view is sophisticated...
//  the algo to convert the data into CSV is very rudimentary
//  the view is a proof of concept

export class CsvView extends TextFileView {
  tableData: string[][];
  tableEl: HTMLElement;

  async onOpen() {
    this.tableEl = this.contentEl.createEl("table");
    this.tableEl.classList.add('csv');
  }
  async onClose() {
    this.contentEl.empty();
  }


  getViewData(): string {
      return this.tableData.map(row => row.map(c => c.trim()).join(",")).join("\n");
  }

  setViewData(data: string, clear: boolean): void {
      this.tableData = data.split("\n").map(line => line.split(","));

      this.refresh();
  }

  clear(): void {
      this.tableData = [];
  }

  getViewType(): string {
      return VIEW_TYPE_CSV;
  }

  refresh() {
    //remove old data
    this.tableEl.empty();

    const bodyEl = this.tableEl.createEl("tbody");

    this.tableData.forEach((row, i) => {
      const rowEl = bodyEl.createEl("tr");
      row.forEach((cell, j) => {
        const inputEl = rowEl
          .createEl("td")
          .createEl("input", { value: cell.trim() });
        inputEl.oninput = (ev) => {
          if (ev.currentTarget instanceof HTMLInputElement) {
            this.tableData[i][j] = ev.currentTarget.value?.trim();
            this.requestSave();
          }
        }
      });
    });

    this.addNewRowButton();
  }

  private addNewRowButton() {

    const footerEl = this.tableEl.createEl("tfoot");

    const rowEl = footerEl.createEl('tr');
    const cellEl = rowEl.createEl('td');
    cellEl.colSpan = this.columnCount() || 1;
    const btnEl = cellEl.createEl('button', { text: '+'});
    btnEl.onclick = (ev) => {
      this.addRow();
      this.refresh(); 
      this.setFocus();     
    }
  }

  private addRow() {
    const columns = this.columnCount();
    const newRow = new Array(columns);
    newRow.fill('');
    this.tableData.push(newRow);    
  }

  private setFocus(row?: number, col?: number) {
    row = typeof(row) === 'number' ? row : this.tableData.length; //default to the last row;
    col = typeof(col) === 'number' ? col : 0;                     //default to the first column;
    console.log(`setting focus to row:${row}, col:${col}`);

    const rows = Array.from(this.tableEl.querySelectorAll('tbody tr')); //get all row elements as an array
    const selectedRow = rows.length <= row ? rows[row-1] : rows[0];
    if (selectedRow) {
      const cols = Array.from(selectedRow.querySelectorAll('td'));      //get the cell elements as an array
      const selectedCell = cols.length <= col ? cols[col-1] : cols[0];
      if (selectedCell) {
        const input = selectedCell.querySelector('input');
        if (input) { 
          console.log("success");
          input.focus(); 
        }
      }
    }
  }

  private columnCount() {
    return this.tableData?.length > 0 ? this.tableData[0].length : 0;
  }
}