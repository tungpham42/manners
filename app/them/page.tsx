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
  query,
  where,
} from "firebase/firestore";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useAuth } from "@/hooks/useAuth";
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
  userId: string;
};

const categoryLabels: { [key: string]: string } = {
  school: "Trường học",
  family: "Gia đình",
  work: "Công sở",
  general: "Khác",
};

export default function AddNewPage() {
  const { user, loading: authLoading } = useAuth();
  const [manners, setManners] = useState<Manner[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchManners = async () => {
    if (!user) return;

    const q = query(collection(db, "manners"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Manner)
    );
    setManners(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await updateDoc(doc(db, "manners", editingId), {
        ...form,
        userId: user.uid,
      });
    } else {
      await addDoc(collection(db, "manners"), {
        ...form,
        userId: user.uid,
      });
    }
    resetForm();
    fetchManners();
  };

  const handleDelete = async (id: string) => {
    const manner = manners.find((m) => m.id === id);
    if (manner?.userId !== user?.uid) return;

    await deleteDoc(doc(db, "manners", id));
    fetchManners();
  };

  const handleEdit = (manner: Manner) => {
    if (manner.userId !== user?.uid) return;

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
    if (user) {
      fetchManners();
    } // eslint-disable-next-line
  }, [user]);

  if (authLoading)
    return <p className="text-center fs-5 text-muted">Đang tải dữ liệu...</p>;
  if (!user)
    return (
      <p className="text-center fs-5 text-muted">
        Vui lòng đăng nhập để tiếp tục
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
            Quản Lý Phép Xã Giao
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

      <Row>
        {manners.map((manner) => (
          <Col key={manner.id} md={6} lg={4} className="mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="p-4">
                  <Card.Title className="fw-bold fs-5">
                    {manner.title}
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {categoryLabels[manner.category] || manner.category}
                  </Card.Subtitle>
                  <Card.Text className="text-muted">
                    {manner.description}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(manner)}
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      disabled={manner.userId !== user.uid}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(manner.id)}
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      disabled={manner.userId !== user.uid}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Xóa
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
