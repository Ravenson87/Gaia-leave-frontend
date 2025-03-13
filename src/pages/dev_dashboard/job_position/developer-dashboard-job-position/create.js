import {useState} from "react";
import {Button, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import * as React from "react";
import {createJobPosition} from "../../../../api/jobPosition";


const CreateJobPosition = ({setVisible, get}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  function saveData() {
    if (0 === title?.length) {
      setError(true);
      return;
    }
    const jsonData = {
      title: title,
      description: description
    }

    createJobPosition(jsonData).then((response) => {
      if (response.status === 201) {
        get();
        setVisible(false);
      }
    })
  }

    return (
      <div className="w-100 col-md-12 row">
        <div className="col-md-12 d-flex justify-content-end">
          <Button variant="outlined"
                  className="my-3"
                  startIcon={<CloseIcon/>}
                  onClick={() => setVisible(false)}
          >Close</Button>
        </div>

        <div className="col-md-5">
          <TextField className="w-100"
                     id="outlined-basic"
                     label="Title"
                     variant="outlined"
                     error={error}
                     value={title}
                     onChange={(e) => {
                       setTitle(e.target.value);
                       setError(false);
                     }}/>
          {error && (<p style={{color: 'red'}}>This field is required.</p>)}
        </div>

        <div className="col-md-6">
          <TextField className="w-100"
                     id="outlined-basic"
                     label="Description"
                     variant="outlined"
                     error={error}
                     value={description}
                     onChange={(e) => {
                       setDescription(e.target.value);
                       setError(false);
                     }}/>
          {error && (<p style={{color: 'red'}}>This field is required.</p>)}
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
    )
}

export default CreateJobPosition;
