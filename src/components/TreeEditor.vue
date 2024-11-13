<template>
  <q-dialog
    :model-value="nodeEditedData !== null"
    @update:model-value="cancelEditNode"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <q-input
          v-model="nodeEditedData.label"
          dense
          autofocus
          @keyup.enter="saveEditedNode"/>
      </q-card-section>

      <q-card-actions
        align="right"
        class="text-primary"
      >
        <q-btn
          flat
          label="Cancel"
          v-close-popup
        />
        <q-btn
          flat
          label="Save"
          @click="saveEditedNode"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="flex column grow q-pa-md">
    <div class="q-ml-lg">
    <q-btn
      class="q-pa-sm"
      color="primary"
      icon="add"
      size="md"
      @click.stop="addNode(null, null)"
    />
    </div>
  <q-tree
    v-if="nodes"
    :nodes="nodes"
    node-key="id"
    label-key="label"
    default-expand-all
  >
    <template v-slot:default-header="prop">
      <q-card
        class="q-pa-md"
        flat
      >
        <div class="text-subtitle2 text-center">{{ prop.node.label }}</div>
        <q-card-actions>
          <q-btn
            outline
            color="green-9"
            icon="edit"
            @click.stop="editNode(prop.node)"
          />
          <q-btn
            outline
            color="negative"
            icon="close"
            @click.stop="removeNode(prop.node)"
          />
          <q-btn
            outline
            color="primary"
            icon="add"
            @click.stop="addNode(prop.node, prop)"
          />
        </q-card-actions>
      </q-card>
    </template>
  </q-tree>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { uid } from 'quasar';
import { LOCAL_STORAGE_KEYS } from 'src/constants';
import {
  getItem, setItem, deleteNode, updateNodeData,
} from 'src/helpers';

class Node {
  constructor(label, parentId, id = uid()) {
    this.id = id;
    this.parentId = parentId;
    this.label = label;
    this.children = [];
  }
}

const nodes = ref(null);

const getNodesState = () => {
  const state = getItem(LOCAL_STORAGE_KEYS.TREE_STATE);
  if (state) {
    nodes.value = state;
  } else {
    nodes.value = [new Node('Root', null)];
  }
};

const setNodesState = () => {
  setItem(LOCAL_STORAGE_KEYS.TREE_STATE, nodes.value);
};

onMounted(() => {
  getNodesState();
});

const addNode = (node, prop) => {
  if (node === null) {
    const newNode = new Node(
      'Root',
      null,
    );
    nodes.value.push(newNode);
  } else {
    const newNode = new Node('New element', node.id);
    node.children.push(newNode);
    prop.expanded = true;
  }
  setNodesState();
};

const removeNode = (node) => {
  deleteNode(nodes.value, node.id, node.parentId);
  setNodesState();
};

const nodeEditedData = ref(null);
const editNode = (node) => {
  nodeEditedData.value = new Node(node.label, node.parentId, node.id);
};
const saveEditedNode = () => {
  if (nodeEditedData.value.label === '') {
    return;
  }
  updateNodeData(
    nodes.value,
    nodeEditedData.value.id,
    { label: nodeEditedData.value.label },
  );
  setNodesState();
  nodeEditedData.value = null;
};
const cancelEditNode = () => {
  nodeEditedData.value = null;
};
</script>
