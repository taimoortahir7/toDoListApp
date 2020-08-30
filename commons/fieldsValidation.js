import {buttonColor} from '../assets/colors';

const textInputChangeFunc = (text, fieldReference) => {
    if(text.length === 0) {
        fieldReference.setNativeProps({
            borderColor: 'red',
            borderBottomWidth: 1
        });
        return true;
    } else {
        fieldReference.setNativeProps({
            borderColor: buttonColor,
            borderBottomWidth: 1
        });
        return false;
    }
};

const checkFieldsValidity = (fields) => {
    let errors = [];
    for(let i=0; i<fields.length-1; i++) {
        errors[i] = true;
    }
    fields.forEach((item, index) => {
        if(item.value.length === 0) {
            item.reference.setNativeProps({
                borderColor: 'red',
                borderBottomWidth: 1
            });
            errors[index] = true;
        } else {
            errors[index] = false;
        }
    });

    return errors.every(item => item === false);
};

export {textInputChangeFunc, checkFieldsValidity};