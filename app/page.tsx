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
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import PaginationControls from "@/components/PaginationControls";

type Manner = {
  id: string;
  title: string;
  description: string;
  category: string;
};

const categoryMap: Record<string, { label: string; icon: JSX.Element }> = {
  all: { label: "Tất Cả", icon: <FontAwesomeIcon icon={faGlobe} /> },
  school: { label: "Học Đường", icon: <FontAwesomeIcon icon={faSchool} /> },
  family: { label: "Gia Đình", icon: <FontAwesomeIcon icon={faHome} /> },
  work: { label: "Công Sở", icon: <FontAwesomeIcon icon={faBriefcase} /> },
  general: { label: "Khác", icon: <FontAwesomeIcon icon={faBook} /> },
};

const ITEMS_PER_PAGE = 12;
const MAX_DESCRIPTION_LENGTH = 100; // Maximum characters for summary

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

  // Function to truncate description for summary
  const truncateDescription = (description: string) => {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    }
    return `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...`;
  };

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

      <Row className="d-flex align-items-stretch">
        <AnimatePresence>
          {paginated.map((manner) => (
            <Col key={manner.id} md={6} lg={4} className="mb-4 d-flex">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="d-flex w-100"
              >
                <Card
                  className="h-100 border-0 shadow-sm flex-fill"
                  onClick={() => handleShowModal(manner)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body className="p-4 d-flex flex-column">
                    <Card.Title className="text-primary fw-bold fs-5 d-flex align-items-center gap-2">
                      {categoryMap[manner.category]?.icon || (
                        <FontAwesomeIcon icon={faBook} />
                      )}
                      {manner.title}
                    </Card.Title>
                    <Card.Text className="my-3 text-muted">
                      {truncateDescription(manner.description)}
                    </Card.Text>
                    <span
                      className="badge bg-accent-color text-white px-3 py-2 mt-auto"
                      style={{ width: "fit-content" }}
                    >
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="d-flex flex-column gap-2">
            {selectedManner ? (
              <>
                <h3 className="fw-bold">{selectedManner.title}</h3>
                <span
                  className="badge bg-accent-color text-white"
                  style={{ width: "fit-content" }}
                >
                  {categoryMap[selectedManner.category]?.label ||
                    "Không xác định"}
                </span>
              </>
            ) : (
              "Không xác định"
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0" style={{ whiteSpace: "pre-wrap" }}>
          <div className="py-3">
            {selectedManner?.description || "Không có mô tả"}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
