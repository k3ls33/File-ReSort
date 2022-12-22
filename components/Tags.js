import React from "react";
import { Form } from "semantic-ui-react";

export default function Tags({obj, onChange}) {
    return (
        <Form.Group onChange={onChange}>
            {obj.map(block =>
                block.children.map(child => {
                    if (child.children) {
                        const txt = child.children[0].text;
                        const currentVal = child.value;
                        console.log(JSON.stringify(currentVal));
        
                        return (
                            <Form.Checkbox value={currentVal} label={txt} />
                        );
                    }
                })
            )}
        </Form.Group>
    );
}