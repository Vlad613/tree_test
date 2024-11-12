const findNode = (tree, nodeId) => {
  if (!tree) return null;

  const [node] = tree;
  if (node.id === nodeId) return node;

  const children = node.children || [];
  return children.reduce((foundNode, child) => {
    if (foundNode) return foundNode;
    return findNode([child], nodeId);
  }, null);
};

const updateNodeData = (tree, nodeID, newData) => {
  const node = findNode(tree, nodeID);
  if (!node) return tree;
  /** prevent accidental override of important fields like "id" and "children" * */
  const { id, children, ...restData } = newData;
  Object.assign(node, restData);
  return tree;
};

const deleteNode = (tree, nodeIdToDelete, nodeParentId) => {
  /** delete root node * */
  if (!nodeParentId) {
    const index = tree.findIndex((el) => el.id === nodeIdToDelete);
    tree.splice(index, 1);
  }
  if (tree?.length === 0 || !nodeParentId) {
    tree = null;
    return tree;
  }

  /** delete child node * */
  const nodeToDelete = findNode(tree, nodeIdToDelete);
  const parent = findNode(tree, nodeParentId);

  const index = parent.children.indexOf(nodeToDelete);
  if (index === -1) return tree;

  parent.children.splice(index, 1);
  return tree;
};

export {
  findNode, updateNodeData, deleteNode,
};
