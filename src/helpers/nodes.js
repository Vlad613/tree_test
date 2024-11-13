/**
 * Function to search a node in a tree-like array.
 *
 * @param {Object[]} tree - Tree-like array of nodes.
 * @param {number} nodeId - ID of the node to find.
 * @returns {Object|null} Found node or null if not found.
 */
const findNode = (tree, nodeId) => {
  /** If the tree is empty, return null */
  if (!tree.length) return null;

  /** Search for the node in the current tree level */
  const currentNode = tree.find((node) => node.id === nodeId);

  // Если нода найдена, возвращаем ее
  if (currentNode) return currentNode;

  /** If the node is not found, search recursively in children nodes */
  // eslint-disable-next-line no-restricted-syntax
  for (const node of tree) {
    if (node.children) {
      const foundNode = findNode(node.children, nodeId);
      if (foundNode) return foundNode;
    }
  }

  /** If the node is not found in any level of the tree, return null */
  return null;
};

const updateNodeData = (tree, nodeID, newData) => {
  const node = findNode(tree, nodeID);
  if (!node) return tree;
  /** prevent accidental override of important fields like "id" and "children" */
  const { id, children, ...restData } = newData;
  Object.assign(node, restData);
  return tree;
};

const deleteNode = (tree, nodeIdToDelete, nodeParentId) => {
  /** delete root node */
  if (!nodeParentId) {
    const index = tree.findIndex((el) => el.id === nodeIdToDelete);
    tree.splice(index, 1);
  }
  if (tree?.length === 0 || !nodeParentId) {
    tree = null;
    return tree;
  }

  /** delete child node */
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
