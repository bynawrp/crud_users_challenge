import dayjs from "dayjs"
import 'dayjs/locale/fr.js';
import customParseFormat from "dayjs/plugin/customParseFormat.js"

dayjs.extend(customParseFormat);

export const validateDate = (date) => {
    return dayjs(date).isValid();
}

export const convertDate = (date, format = 'DD-MM-YYYY', currFormat = 'YYYY-DD-MM') => {
    // console.log(date, format, currFormat)
    const dateTarget = dayjs(date, format, true);

    if (dateTarget.isValid()) {
        return date;
    }

    return dayjs(date, currFormat).format(format);
}

export const displayError = (name, date) => {
    if (name.trim() === "")
        return 'Le champ "nom" ne peut pas etre vide.'

    else if (date.trim() === "")
        return 'Le champ "date" ne peut pas etre vide.'

    else if (!validateDate(date))
        return 'Le champ "date" n\'est pas valide.'

    return
}