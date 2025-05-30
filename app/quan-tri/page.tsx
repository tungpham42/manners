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
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
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

  const fetchManners = async () => {
    const snapshot = await getDocs(collection(db, "manners"));
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Manner)
    );
    setManners(data);
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

  useEffect(() => {
    fetchManners();
  }, []);

  const loading = useAdminGuard();
  if (loading)
    return <p className="text-center">Đang kiểm tra quyền truy cập...</p>;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <FontAwesomeIcon icon={faTag} className="me-2" />
          Quản Trị - Phép Xã Giao
        </h2>
        <UserInfo />
      </div>

      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Card.Title className="fw-semibold">
            {editingId ? "Cập nhật phép xã giao" : "Thêm phép xã giao mới"}
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Nhập tiêu đề"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                as="textarea"
                rows={4}
                required
                placeholder="Nhập mô tả"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phân loại</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="school">Trường học</option>
                <option value="family">Gia đình</option>
                <option value="work">Công sở</option>
                <option value="general">Khác</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={editingId ? faEdit : faPlus} />
                {editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
              {editingId && (
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                  className="d-flex align-items-center gap-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Hủy
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {manners.map((manner) => (
          <Col key={manner.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-semibold">{manner.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {categoryLabels[manner.category] || manner.category}
                </Card.Subtitle>
                <Card.Text>{manner.description}</Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(manner)}
                    className="d-flex align-items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(manner.id)}
                    className="d-flex align-items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Xóa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
