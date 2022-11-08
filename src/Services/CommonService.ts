interface QueryOptions {
    param: string;
    value: string;
}

export const checkIfExists = async (_model: any, options: QueryOptions) => {
    const { param, value } = options;
    let searchOptions: any = {};
    searchOptions[`${param}`] = {
        $regex: new RegExp(`${value}`),
        $options: 'i'
    };
    const exist = await _model.exists(searchOptions);
    return exist ? true : false;
}
