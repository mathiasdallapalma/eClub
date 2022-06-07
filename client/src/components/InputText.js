import React from 'react';
import "./InputText.css"

const InputText = ({type ,id, label, onChangeHeadline,defaultValue}) => (
    <div>
        <label>{label}</label>
        <div className='inputText'>      
            <input type={type} 
                id={id} 
                onChange={onChangeHeadline}
                defaultValue={defaultValue}
            />
        </div>
      
    </div>
  );

export default InputText;