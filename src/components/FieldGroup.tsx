
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Button, Card, Input, Select, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

interface FieldGroupProps {
  nestIndex: number;
  fieldPath: string;
}

export default function FieldGroup({ fieldPath }: FieldGroupProps) {
  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${fieldPath}.fields`,
  });

  const currentFields = watch(`${fieldPath}.fields`) || [];

  return (
    <div style={{ marginLeft: 20, marginTop: 10 }}>
      {fields.map((field, index) => {
        const currentPath = `${fieldPath}.fields.${index}`;
        const currentType = currentFields[index]?.type;

        return (
          <Card
            size="small"
            key={field.id}
            className="mb-2"
            title={`Nested Field ${index + 1}`}
            extra={
              <Button
                size="small"
                icon={<MinusCircleOutlined />}
                onClick={() => remove(index)}
                danger
              />
            }
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Controller
                control={control}
                name={`${currentPath}.name`}
                render={({ field }) => (
                  <Input {...field} placeholder="Field name" />
                )}
              />

              <Controller
                control={control}
                name={`${currentPath}.type`}
                render={({ field }) => (
                  <Select {...field} placeholder="Field type">
                    <Option value="string">String</Option>
                    <Option value="number">Number</Option>
                    <Option value="float">Float</Option>
                    <Option value="boolean">Boolean</Option>
                    <Option value="objectId">ObjectId</Option>
                    <Option value="array">Array</Option>
                    <Option value="nested">Nested</Option>
                  </Select>
                )}
              />

              {currentType === "nested" && (
                <FieldGroup
                  nestIndex={index}
                  fieldPath={`${currentPath}`}
                />
              )}
            </Space>
          </Card>
        );
      })}

      <Button
        size="small"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => append({ name: "", type: "string" })}
        block
      >
        Add Nested Field
      </Button>
    </div>
  );
}
