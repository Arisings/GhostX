const Toolkit = Java.type("java.awt.Toolkit")
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor")

export default function getClipboardContents() {
    const clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    const data = clipboard.getData(DataFlavor.stringFlavor);
    return data;
}