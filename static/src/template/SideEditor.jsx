import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material/';
import { isBoolean, isEmpty } from "lodash";
import Editable from './Editable';
import Switch from "@mui/material/Switch";

// TODO: give q-node label an external URL to wikidata
// TODO: checkbox for true/false fields
// TODO: change into FormControls from MUI
function SideEditor(props) {
    /*
    Handles sidebar that shows general information about a node
    selected via right-click.

    When an inline field is left-clicked to be edited, the
    original data is frozen in 'edit'.
    The JSON is only changed if the field is changed out of
    focus and the field is different from the frozen data. 
    */
    const initData = {
        propData: props.data,
    };

    const [data, setData] = useState(initData);
    const [edit, setEdit] = useState('');

    useEffect(() => {
        setData({ ...data, propData: props.data })
    }, [props.data])

    const handleUpdate = (e) => {
        data.propData[e.target.name] = e.target.value;
        setData({ ...data });
    }

    const handleEdit = (e) => {
        const node_data = {
            id: data.propData['id'],
            key: e.target.name,
            value: e.target.value
        };
        if (e.target.value !== edit)
            props.sideEditorCallback(node_data);
    }

    const handleCheck = (key, val) => {
        console.log(key)
        console.log(val)
        data.propData[key] = !val;
        setData({ ...data });
        // const node_data = {
        //     id: data.propData['id'],
        //     key: key,
        //     value: val
        // };
        // console.log(node_data)
        // props.sideEditorCallback(node_data);
    }

    let i = 0;
    const excluded_ids = ['id', '_label', '_type', '_shape', 'outlinks', '_edge_type', 'child'];

    return (
        <div className={props.className}>
            {isEmpty(data.propData) ? '' :
                <List disablePadding dense>
                    {Object.entries(data.propData).sort().map(([key, val]) => {
                        if (!excluded_ids.includes(key)) {
                            val = isBoolean(val) ? val : val.toString()
                            return (
                                <div key={++i}>
                                    <ListItem key={key}>
                                        <ListItemText style={{ 'overflowWrap': 'anywhere' }}>
                                            <div>{key.toUpperCase()}</div>
                                            <div>
                                                {isBoolean(val)
                                                    ? <Switch checked={val} onChange={handleCheck(key, val)} />
                                                    : <Editable text={val} placeholder={val} type="input">
                                                        <input type="text"
                                                            name={key}
                                                            placeholder={isEmpty(val) ? key : val}
                                                            value={val}
                                                            onClick={e => setEdit(e.target.value)}
                                                            onChange={e => handleUpdate(e)}
                                                            onBlur={e => handleEdit(e)}
                                                        />
                                                      </Editable>}
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                </div>
                            )
                        }
                    })}
                </List>
            }
        </div>
    );
}

export default SideEditor;