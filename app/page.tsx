"use client";

import { JSX, useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHome,
  faBriefcase,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import PaginationControls from "@/components/PaginationControls";

type Manner = {
  id: string;
  title: string;
  description: string;
  category: string;
};

const categoryMap: Record<string, { label: string; icon: JSX.Element }> = {
  all: { label: "Tất Cả", icon: <FontAwesomeIcon icon={faBook} /> },
  school: { label: "Học Đường", icon: <FontAwesomeIcon icon={faSchool} /> },
  family: { label: "Gia Đình", icon: <FontAwesomeIcon icon={faHome} /> },
  work: { label: "Công Sở", icon: <FontAwesomeIcon icon={faBriefcase} /> },
  general: { label: "Khác", icon: <FontAwesomeIcon icon={faBook} /> },
};

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [manners, setManners] = useState<Manner[]>([]);
  const [selected, setSelected] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedManner, setSelectedManner] = useState<Manner | null>(null);

  useEffect(() => {
    const fetchManners = async () => {
      const snapshot = await getDocs(collection(db, "manners"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Manner[];
      setManners(data);
    };
    fetchManners();
  }, []);

  const filtered =
    selected === "all"
      ? manners
      : manners.filter((m) => m.category === selected);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelect = (category: string) => {
    setSelected(category);
    setCurrentPage(1);
  };

  const handleShowModal = (manner: Manner) => {
    setSelectedManner(manner);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedManner(null);
  };

  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-3 fw-bold fs-2">
          <FontAwesomeIcon icon={faBook} className="me-2 text-accent-color" />
          Phép Đối Nhân Xử Thế
        </h1>
        <p className="text-center text-muted mb-5 fs-5">
          Khám phá các quy tắc ứng xử tinh tế cho mọi hoàn cảnh xã hội.
        </p>
      </motion.div>

      <div className="d-flex justify-content-center mb-5 flex-wrap gap-3">
        {Object.entries(categoryMap).map(([key, { label, icon }]) => (
          <Button
            key={key}
            onClick={() => handleSelect(key)}
            variant={selected === key ? "primary" : "outline-primary"}
            className="fw-medium d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm"
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>

      <Row>
        <AnimatePresence>
          {paginated.map((manner) => (
            <Col key={manner.id} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="h-100 border-0 shadow-sm"
                  onClick={() => handleShowModal(manner)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="p-4">
                    <Card.Title className="text-primary fw-bold fs-5 d-flex align-items-center gap-2">
                      {categoryMap[manner.category]?.icon || (
                        <FontAwesomeIcon icon={faBook} />
                      )}
                      {manner.title}
                    </Card.Title>
                    <span className="badge bg-accent-color text-white px-3 py-2">
                      {categoryMap[manner.category]?.label || "Không xác định"}
                    </span>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedManner ? (
              <>
                {selectedManner.title}
                <span className="ms-2 badge bg-accent-color text-white">
                  {categoryMap[selectedManner.category]?.label ||
                    "Không xác định"}
                </span>
              </>
            ) : (
              "Không xác định"
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedManner?.description || "Không có mô tả"}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
