interface QueryOptions {
    param: string;
    value: string;
}

export const checkIfExists = (_model: any, options: QueryOptions) => {
    const { param, value } = options;
    const exists = _model.findOne({ param: value }).select(`${param}`);
    return exists;
}