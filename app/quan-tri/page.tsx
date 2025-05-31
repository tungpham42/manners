"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  Form,
  Button,
  Table,
  Card,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import UserInfo from "@/components/UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

type Manner = {
  id: string;
  title: string;
  description: string;
  category: string;
};

const categoryLabels: { [key: string]: string } = {
  school: "Trường học",
  family: "Gia đình",
  work: "Công sở",
  general: "Khác",
};

export default function DashboardPage() {
  const [manners, setManners] = useState<Manner[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchManners = async () => {
    const snapshot = await getDocs(collection(db, "manners"));
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Manner)
    );
    setManners(data);
    setCurrentPage(1); // Reset to first page when data changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "manners", editingId), form);
    } else {
      await addDoc(collection(db, "manners"), form);
    }
    resetForm();
    fetchManners();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "manners", id));
    fetchManners();
  };

  const handleEdit = (manner: Manner) => {
    setForm({
      title: manner.title,
      description: manner.description,
      category: manner.category,
    });
    setEditingId(manner.id);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", category: "general" });
    setEditingId(null);
  };

  // Search and filter logic
  const filteredManners = manners.filter(
    (manner) =>
      manner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manner.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredManners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredManners.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  useEffect(() => {
    fetchManners();
  }, []);

  const loading = useAdminGuard();
  if (loading)
    return (
      <p className="text-center fs-5 text-muted">
        Đang kiểm tra quyền truy cập...
      </p>
    );

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold fs-3">
            <FontAwesomeIcon icon={faTag} className="me-2 text-accent-color" />
            Quản Trị - Phép Xã Giao
          </h2>
          <UserInfo />
        </div>

        <Card className="mb-5 shadow-sm border-0">
          <Card.Body className="p-4">
            <Card.Title className="fw-bold fs-5">
              {editingId ? "Cập nhật phép xã giao" : "Thêm phép xã giao mới"}
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Tiêu đề</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Nhập tiêu đề"
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-medium">Mô tả</Form.Label>
                <Form.Control
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  as="textarea"
                  rows={4}
                  required
                  placeholder="Nhập mô tả chi tiết"
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Phân loại</Form.Label>
                <Form.Select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="rounded-3"
                >
                  <option value="school">Trường học</option>
                  <option value="family">Gia đình</option>
                  <option value="work">Công sở</option>
                  <option value="general">Khác</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-3">
                <Button
                  type="submit"
                  className="d-flex align-items-center gap-2 px-4 py-2 rounded-3"
                >
                  <FontAwesomeIcon icon={editingId ? faEdit : faPlus} />
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </Button>
                {editingId && (
                  <Button
                    variant="outline-primary"
                    onClick={resetForm}
                    className="d-flex align-items-center gap-2 px-4 py-2 rounded-3"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Hủy
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Group className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0">Tìm kiếm:</Form.Label>
            <InputGroup style={{ width: "300px" }}>
              <Form.Control
                type="text"
                placeholder="Tìm theo tiêu đề hoặc mô tả"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="rounded-3"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Số mục mỗi trang:</Form.Label>
            <Form.Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: "80px" }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </Form.Group>
          <div>
            Trang {currentPage} / {totalPages}
          </div>
        </div>

        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Phân loại</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              currentItems.map((manner) => (
                <tr key={manner.id}>
                  <td>{manner.title}</td>
                  <td>{categoryLabels[manner.category] || manner.category}</td>
                  <td>{manner.description}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(manner)}
                        className="d-flex align-items-center gap-2 px-3 py-1 rounded-3"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(manner.id)}
                        className="d-flex align-items-center gap-2 px-3 py-1 rounded-3"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Pagination className="justify-content-center mt-3">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </motion.div>
    </Container>
  );
}
