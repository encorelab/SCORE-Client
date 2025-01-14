import { ComponentContent } from './ComponentContent';
import { Node } from './Node';

const componentId1 = 'c1';
const componentId2 = 'c2';
let node: Node;

describe('Node', () => {
  beforeEach(() => {
    node = new Node();
    node.components = [
      { id: componentId1, prompt: 'a' },
      { id: componentId2, prompt: 'b' }
    ];
  });
  copyComponents();
  deleteComponent();
  getNodeIcon();
  getNodeIdComponentIds();
  moveComponents();
  replaceComponent();
});

function copyComponents() {
  describe('copyComponents() without specifying insertAfterComponentId', () => {
    it('should copy the components, insert at the beginning and return new components', () => {
      const copies = node.copyComponents([componentId1, componentId2]);
      expect(node.components.length).toEqual(4);
      expect(copies.length).toEqual(2);
      expect(copies[0].id).not.toEqual(componentId1);
      expect(copies[1].id).not.toEqual(componentId2);
    });
  });
}

function deleteComponent() {
  describe('deleteComponent()', () => {
    it('should delete the component from the node and return the component', () => {
      const deletedComponent = node.deleteComponent(componentId1);
      expect(deletedComponent.id).toEqual(componentId1);
      expect(node.components.length).toEqual(1);
      expect(node.components[0].id).toEqual(componentId2);
    });
  });
}

function getNodeIcon() {
  describe('getNodeIcon()', () => {
    getNodeIcon_noIconSpecified_returnDefaultIcon();
    getNodeIcon_iconSpecified_returnMergedIcon();
  });
}

function getNodeIcon_noIconSpecified_returnDefaultIcon() {
  it('should return default icon if icon is not set', () => {
    const icon = node.getIcon();
    expect(icon.color).toEqual('#757575');
    expect(icon.type).toEqual('font');
  });
}

function getNodeIcon_iconSpecified_returnMergedIcon() {
  it('should return merged icon if an icon is set', () => {
    node.icons = {
      default: {
        color: 'rgba(0,1,1,0)',
        fontName: 'check'
      }
    };
    const icon = node.getIcon();
    expect(icon.color).toEqual('rgba(0,1,1,0)');
    expect(icon.fontName).toEqual('check');
  });
}

function getNodeIdComponentIds() {
  it('should get the node id and component id objects', () => {
    node.id = 'node1';
    node.components = [{ id: 'abc' }, { id: 'xyz' }];
    const nodeIdAndComponentIds = node.getNodeIdComponentIds();
    expect(nodeIdAndComponentIds.length).toEqual(2);
    expect(nodeIdAndComponentIds[0].nodeId).toEqual('node1');
    expect(nodeIdAndComponentIds[0].componentId).toEqual('abc');
    expect(nodeIdAndComponentIds[1].nodeId).toEqual('node1');
    expect(nodeIdAndComponentIds[1].componentId).toEqual('xyz');
  });
}

function moveComponents() {
  describe('moveComponents()', () => {
    beforeEach(() => {
      node.components = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }];
    });
    moveComponents_NullInsertAfterComponentId_MoveComponentsToBeginning();
    moveComponents_NonNullInsertAfterComponentId_MoveMultipleComponentsAfterComponent();
  });
}

function moveComponents_NullInsertAfterComponentId_MoveComponentsToBeginning() {
  describe('insertAfterComponentId is null', () => {
    it('should move components to the beginning of the node', () => {
      node.moveComponents(['b', 'c', 'e'], null);
      expect(node.components.map((component) => component.id).join(',')).toEqual('b,c,e,a,d');
    });
  });
}

function moveComponents_NonNullInsertAfterComponentId_MoveMultipleComponentsAfterComponent() {
  describe('insertAfterComponentId is not null', () => {
    it('should move components after the specified component', () => {
      node.moveComponents(['b', 'c', 'e'], 'a');
      expect(node.components.map((component) => component.id).join(',')).toEqual('a,b,c,e,d');
    });
  });
}

function replaceComponent() {
  describe('replaceComponent()', () => {
    it('should replace the specified component', () => {
      node.replaceComponent(componentId2, { id: componentId2, prompt: 'c' } as ComponentContent);
      expect(node.components[1].prompt).toEqual('c');
    });
  });
}
