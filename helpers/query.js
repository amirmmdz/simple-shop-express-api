const buildHierarchy = async (Model, parentField = 'parentId', idField = '_id') => {
    const documents = await Model.find().lean();
    const createHierarchy = (parentId = null) => {
        return documents
            .filter(doc => String(doc[parentField]) === String(parentId))
            .map(doc => ({
                ...doc,
                children: createHierarchy(doc[idField])
            }));
    };
    return createHierarchy();
};


const buildHierarchyForOne = async (Model, id, parentField = 'parentId', idField = '_id') => {
    const rootDocument = await Model.findOne({ _id: id }).lean();
    
    if (!rootDocument) {
        throw new Error('Document not found');
    }
    const documents = await Model.find().lean();
    const createHierarchy = (parentId) => {
        return documents
            .filter(doc => String(doc[parentField]) === String(parentId))
            .map(doc => ({
                ...doc,
                children: createHierarchy(doc[idField])
            }));
    };
    return {
        ...rootDocument,
        children: createHierarchy(rootDocument[idField])
    };
};

module.exports = {
    buildHierarchy,
    buildHierarchyForOne
};
