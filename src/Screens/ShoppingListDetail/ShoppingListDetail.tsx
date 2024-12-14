import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Popup, Input, Loading, Form } from "antd-mobile";
import { useLazyGetShoppingListQuery, useDeleteShoppingListMutation, useCreateShoppingListMutation, useUpdateShoppingListMutation } from "@/Services/shoppingList";

// type any = {
//   id: string;
//   name: string;
//   quantity: number;
// };

const mockUserId = '84ef5319-acef-4d19-b048-fdf00ff3e386';

export const ShoppingListDetail: React.FC = () => {
  const [fetchShoppingList, { data: list, isLoading, isError, isFetching }] = useLazyGetShoppingListQuery();
  const [deleteShoppingList] = useDeleteShoppingListMutation();
  const [updateShoppingList] = useUpdateShoppingListMutation();
  const [createShoppingList] = useCreateShoppingListMutation();

  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [form] = Form.useForm();  // Initialize the Form instance

  useEffect(() => {
    fetchShoppingList({ groupId: 'mockGroupId', page, per });
  }, [fetchShoppingList, page, per]);

  if (isLoading && page === 1) {
    return (
      <View style={styles.centered}>
        <Loading />
        <Text>Loading list...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load list. Please try again.</Text>
        <Button onClick={() => {fetchShoppingList({ groupId: 'mockGroupId', page, per })}}>Retry</Button>
      </View>
    );
  }

  const handleCreateNewList = () => {
    setCurrentAction('create');
    form.resetFields();  // Reset the form fields
    setIsModalVisible(true);
  };

  const handleEditList = (item: any) => {
    setCurrentAction('edit');
    setSelectedItem(item);
    form.setFieldsValue({ name: item.name, quantity: item.quantity });  // Set form fields for editing
    setIsModalVisible(true);
  };

  const handleDeleteList = (item: any) => {
    setCurrentAction('delete');
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteShoppingList(selectedItem.id)
        .unwrap()
        .then(() => {
          alert("Shopping list deleted successfully!");
          fetchShoppingList({ groupId: 'mockGroupId', page, per });
          setIsModalVisible(false);
        })
        .catch(() => alert("Failed to delete shopping list."));
    }
  };

  const saveShoppingList = () => {
    form
      .validateFields()
      .then(values => {
        const { name, quantity } = values;
        if (currentAction === 'create') {
          createShoppingList(values)
            .unwrap()
            .then(() => {
              alert("Shopping list created successfully!");
              fetchShoppingList({ groupId: 'mockGroupId', page, per });
              setIsModalVisible(false);
            })
            .catch(() => alert("Failed to create shopping list."));
        } else if (currentAction === 'edit' && selectedItem) {
          updateShoppingList({ ...selectedItem, name, quantity })
            .unwrap()
            .then(() => {
              alert("Shopping list updated successfully!");
              fetchShoppingList({ groupId: 'mockGroupId', page, per });
              setIsModalVisible(false);
            })
            .catch(() => alert("Failed to update shopping list."));
        }
      })
      .catch(error => {
        console.log("Validation Failed:", error);
      });
  };

  const handleLoadMore = () => {
    if (!isFetching && list?.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Lists</Text>
      <Button onClick={handleCreateNewList}>Create New Shopping List</Button>
      {list && list.length > 0 ? (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <View style={styles.buttonContainer}>
                <Button onClick={() => handleEditList(item)}>Edit</Button>
                <Button onClick={() => handleDeleteList(item)}>Delete</Button>
              </View>
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetching ? <Loading /> : null}
        />
      ) : (
        <Text style={styles.noGroupsText}>You don't have any shopping lists yet.</Text>
      )}

      <Popup
        visible={isModalVisible}
        onMaskClick={() => setIsModalVisible(false)}  // Close popup on mask click
        position="bottom"  // Set position for the popup
        destroyOnClose={true}  // Destroy the popup content when closed
      >
        <View style={styles.modalContainer}>
          {currentAction !== 'delete' && (
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label="List Name"
                rules={[{ required: true, message: "Please enter the list name!" }]}
              >
                <Input placeholder="List Name" />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please enter the quantity!" }]}
              >
                <Input
                  placeholder="Quantity"
                  type="number"
                />
              </Form.Item>
            </Form>
          )}
          <View style={styles.modalButtons}>
            {currentAction === 'delete' ? (
              <>
                <Button onClick={confirmDelete}>Confirm Delete</Button>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={saveShoppingList}>Save</Button>
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              </>
            )}
          </View>
        </View>
      </Popup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  groupItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "#ffffff", borderRadius: 8, marginBottom: 8, elevation: 1 },
  noGroupsText: { textAlign: "center", fontSize: 16, color: "gray" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", marginBottom: 16 },
  modalContainer: { padding: 20, backgroundColor: "white", borderRadius: 8 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
