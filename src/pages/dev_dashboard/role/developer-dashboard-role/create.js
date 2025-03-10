import * as React from 'react';
import {Button, TextField} from "@mui/material";
import {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {createRole} from "../../../../api/role";

const CreateRole = ({setCreateModal}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);

    function saveData() {
        if (0 === name?.length) {
            setError(true);
            return;
        }

        const jsonData = {
            name: name,
            description: description
        }

        createRole(jsonData).then((response) => {
            if (response.status === 201) {
                setCreateModal(false);
            }
        })
    }

    return (
        <div className="w-100 col-md-12 row">
            <div className="col-md-12 d-flex justify-content-end">
                <Button variant="outlined"
                        className="my-3"
                        startIcon={<CloseIcon/>}
                        onClick={() => setCreateModal(false)}
                >Close</Button>
            </div>
            <div className="col-md-6">
                <TextField className="w-100" id="outlined-basic" label="Name" variant="outlined"
                           error={error}
                           value={name}
                           onChange={(e) => {
                               setName(e.target.value);
                               setError(false);
                           }}/>
                {error && (<p style={{color: 'red'}}>This field is required.</p>)}
            </div>
            <div className="col-md-6">
                <TextField className="w-100"
                           id="outlined-basic"
                           label="Description"
                           variant="outlined"
                           value={description}
                           onChange={(e) => {
                               setDescription(e.target.value);
                           }}/>
            </div>
            <div className="col-md-12 d-flex justify-content-end">
                <Button variant="contained"
                        className="my-3"
                        startIcon={<SaveIcon/>}
                        onClick={() => saveData()}>
                    Save
                </Button>
            </div>
        </div>
    );
}
export default CreateRole;