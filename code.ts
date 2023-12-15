// I really don't care about quality of the code, but you can make pull request to make it bettor!

// Constants
const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"]
const renameMsgs = ["Cleaned", "Affected", "Made it with", "Fixed", "Glued"]
const idleMsgs = ["No new lines, already", "I see no line breaks", "Any new lines? I can't see it", "Nothing to do, your layers are great"]
const regex = /\r?\n|\r/g

// Variables
let notification: NotificationHandler
let selection: ReadonlyArray<SceneNode>
let working: boolean
let count: number = 0

figma.on("currentpagechange", cancel)

// Main + Elements Check
working = true
selection = figma.currentPage.selection
console.log(selection.length + " selected")
run(selection)


async function run(selection) {
  if (selection.length) {
    for (const node of selection)
      await recursiveClean(node)
    finish()

  }
  else {
    await recursiveClean(figma.currentPage)
    finish()
  }
}

async function recursiveClean(node) {
  if (node.type === "TEXT") {
    if (node.hasMissingFont)
      notify("You have layers with missing fonts")
    else {
      await figma.loadFontAsync(node.fontName)
      node.characters = node.characters.replace(regex, ' ')
      count++
    }
  }
  else if ("children" in node) {
    for (const child of node.children) {
      await recursiveClean(child)
    }
  }
}

function finish() {
  working = false
  figma.root.setRelaunchData({ relaunch: '' })
  // Notification
  if (count > 0) {
    notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
      " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
      " " + ((count === 1) ? "only one layer" : (count + " layers")))

  }
  else notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)])
  figma.closePlugin()
}

function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

function cancel() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}