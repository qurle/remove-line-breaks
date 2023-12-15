// I really don't care about quality of the code, but you can make pull request to make it bettor!
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Constants
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"];
const renameMsgs = ["Cleaned", "Affected", "Made it with", "Fixed", "Glued"];
const idleMsgs = ["No new lines, already", "I see no line breaks", "Any new lines? I can't see it", "Nothing to do, your layers are great"];
const regex = /\r?\n|\r/g;
// Variables
let notification;
let selection;
let working;
let count = 0;
figma.on("currentpagechange", cancel);
// Main + Elements Check
working = true;
selection = figma.currentPage.selection;
console.log(selection.length + " selected");
run(selection);
function run(selection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (selection.length) {
            for (const node of selection)
                yield recursiveClean(node);
            finish();
        }
        else {
            yield recursiveClean(figma.currentPage);
            finish();
        }
    });
}
function recursiveClean(node) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node.type === "TEXT") {
            if (node.hasMissingFont)
                notify("You have layers with missing fonts");
            else {
                yield figma.loadFontAsync(node.fontName);
                node.characters = node.characters.replace(regex, ' ');
                count++;
            }
        }
        else if ("children" in node) {
            for (const child of node.children) {
                yield recursiveClean(child);
            }
        }
    });
}
function finish() {
    working = false;
    figma.root.setRelaunchData({ relaunch: '' });
    // Notification
    if (count > 0) {
        notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
            " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
            " " + ((count === 1) ? "only one layer" : (count + " layers")));
    }
    else
        notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)]);
    figma.closePlugin();
}
function notify(text) {
    if (notification != null)
        notification.cancel();
    notification = figma.notify(text);
}
function cancel() {
    if (notification != null)
        notification.cancel();
    if (working) {
        notify("Plugin work have been interrupted");
    }
}
