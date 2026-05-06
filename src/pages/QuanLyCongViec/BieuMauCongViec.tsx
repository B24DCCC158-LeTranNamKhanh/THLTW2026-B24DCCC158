import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  tags: string[];
  status: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
}

interface BieuMauCongViecProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Task, 'id' | 'status'>) => void;
  initialValues?: Task | null;
}

const BieuMauCongViec: React.FC<BieuMauCongViecProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      });
    });
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Thời hạn"
          rules={[{ required: true, message: 'Vui lòng chọn thời hạn!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
          initialValue="Trung bình"
        >
          <Select>
            <Option value="Cao">Cao</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Thấp">Thấp</Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Thẻ">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm thẻ phân loại" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BieuMauCongViec;
