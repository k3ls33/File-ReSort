import { v4 as uuidv4 } from 'uuid';

export const UUID = () => uuidv4();

export function getSlateJSON(spacy) {
    const out = spacy["annotations"];
    console.log(out);
    const blocks = out.map(item => {
        const block = {
            type: 'paragraph',
            children: []
        };
        const text = item[0];
        const entities = item[1]["entities"];
        const len = entities.length;


        if (len == 0) {
            block.children.push({
                text: text
            });

            return block;
        }

        let start = 0, end = 0;

        entities.forEach(entity => {
            start = entity[0];
            const ignore = ["DATE", "WORK_OF_ART", "CARDINAL"];
            const between = text.slice(end, start);
            block.children.push({ text: between });
            end = entity[1];
            const btnText = text.slice(start, end);

            if (ignore.includes(entity[2])) {
                block.children.push({ text: btnText });
            } else {
                block.children.push({
                    type: 'button',
                    tag: entity[2],
                    value: UUID(),
                    children: [{ text: btnText }]
                });
            }
        })

        return block;
    });

    return blocks;
}

export function initCheck(data) {
    const newChecked = [];

    data.map(block => block.children.map(child => {
        if (child.children) {
            const txt = child.children[0].text;
            const currentVal = child.value;

            newChecked.push({ value: currentVal, checked: false, text: txt });
        }
    }));
    return newChecked;
}

export function updateIDs(data) {
    const out = [];

    data.forEach(obj => {
        const res = obj.children.map(child => {
            let edited = child;

            if (('tag' in child) && !('value' in child)) {
                edited.value = UUID;
            }

            return edited;
        });

        out.push({ type: "paragraph", children: res });
    });

    return out;
}

export function deleteIDs(IDs, data) {
    const out = [];

    data.forEach(obj => {
        const res = obj.children.map(child => {
            let edited = child;

            IDs.forEach(ID => {
                if (child.value === ID) {
                    const txt = child.children[0].text;
                    edited = { text: txt };
                }
            });

            return edited;
        });

        out.push({ type: "paragraph", children: res });
    });

    return out;
}