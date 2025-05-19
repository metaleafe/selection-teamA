// NPCを描画するクラス
class Npc {
  constructor({
    position,
    image,
    sprites,
    dialogue,
    name,
    choices = [], // choicesを空の配列に変更
    defaultDirection,
    width = 48,
    height = 68,
  }) {
    this.position = position;
    this.image = image || sprites[defaultDirection];
    this.sprites = sprites;
    this.dialogue = dialogue || []; // dialogueがnullの場合は空の配列
    this.name = name;
    this.choices = choices;
    this.width = width;
    this.height = height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class ChoiceNpc extends Npc {
  constructor({
    position,
    image,
    sprites,
    dialogue,
    name,
    defaultDirection,
    choices,
  }) {
    super({
      position,
      image,
      sprites,
      dialogue,
      name,
      choices, // choicesをそのまま渡す
      defaultDirection,
    });
  }
  showChoices() {
    const choiceBox = document.getElementById("choiceBox");

    if (!Array.isArray(this.choices) || this.choices.length === 0) {
      choiceBox.classList.add("hidden");
      choiceBox.innerHTML = "";
      return;
    }

    choiceBox.innerHTML = "";
    choiceBox.classList.remove("hidden");

    this.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.textContent = choice.label;
      btn.onclick = () => {
        choiceBox.classList.add("hidden");
        choiceBox.innerHTML = "";

        // ✅ currentDialogue を使って advanceDialogue を動かす場合
        if (typeof choice.advance === "boolean" && choice.advance) {
          advanceDialogue(); // 現在のセリフの次に進む
        }

        // 追加の動作があれば実行
        if (typeof choice.action === "function") {
          choice.action();
        }
      };
      choiceBox.appendChild(btn);
    });
  }
}
