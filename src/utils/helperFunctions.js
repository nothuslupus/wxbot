const validLocationFormat = input => /^[a-zA-Z\s]+,[\s]*[a-zA-Z\s]+$/.test(input);

const formatCity = city => city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

const validateOption = async (slashOption) => {
    if (validLocationFormat(slashOption)) {
        let [localCity, localState] = slashOption.split(',');
        localCity = formatCity(localCity);
        localState = localState.toUpperCase();

        return {
            valid: true,
            data: { city: localCity, state: localState }
        };
    } else {
        return {
            invalid: true,
            message: 'Please provide a valid location in the format "city, state", e.g. "Seattle, WA".'
        };
    }
};

export { validateOption };