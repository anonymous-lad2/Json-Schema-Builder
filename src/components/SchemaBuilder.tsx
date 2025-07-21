
import React from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import { Input, Select, Button, Card, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import FieldGroup from "./FieldGroup.tsx";

const { Option } = Select;

export type FieldType =
  | "string"
  | "number"
  | "float"
  | "boolean"
  | "objectId"
  | "nested"
  | "array";

export interface SchemaField {
  name: string;
  type: FieldType;
  fields?: SchemaField[];
}

export default function SchemaBuilder() {
  const methods = useForm<{ fields: SchemaField[] }>({
    defaultValues: {
      fields: [],
    },
  });

  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    ...rest
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const data = watch("fields");

  const onSubmit = (data: { fields: SchemaField[] }) => {
    const json = generateJSON(data.fields);
    setOutput(json);
};

  return (
    <FormProvider {...methods}>
      <div className="p-6 grid grid-cols-2 gap-6">
        
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Schema Builder</h2>
          {fields.map((field, index) => {
            const path = `fields.${index}`;
            return (
              <Card
                key={field.id}
                size="small"
                className="mb-3"
                title={`Field ${index + 1}`}
                extra={
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(index)}
                    danger
                    size="small"
                  />
                }
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Controller
                    name={`${path}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Field name" />
                    )}
                  />

                  <Controller
                    name={`${path}.type`}
                    control={control}
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

                  
                  {["nested", "array"].includes(
                    watch(`${path}.type`)
                  ) && (
                    <FieldGroup nestIndex={index} fieldPath={path} />
                  )}
                </Space>
              </Card>
            );
          })}
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() =>
              append({ name: "", type: "string", fields: [] })
            }
            block
          >
            Add Field
          </Button>
        </div>

    
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>JSON Preview</h2>
          <pre className="bg-gray-100 p-4 border rounded overflow-auto">
            {JSON.stringify(generateJSON(data), null, 2)}
          </pre>
        </div>
      </div>
    </FormProvider>
  );
}

function generateJSON(fields: SchemaField[] = []): any {
  const obj: Record<string, any> = {};

  for (const field of fields) {
    if (!field.name) continue;

    switch (field.type) {
      case "string":
        obj[field.name] = "string";
        break;
      case "number":
        obj[field.name] = 0;
        break;
      case "float":
        obj[field.name] = 0.0;
        break;
      case "boolean":
        obj[field.name] = false;
        break;
      case "objectId":
        obj[field.name] = "ObjectId('example')";
        break;
      case "array":
        obj[field.name] = [generateJSON(field.fields || [])];
        break;
      case "nested":
        obj[field.name] = generateJSON(field.fields || []);
        break;
      default:
        obj[field.name] = null;
    }
  }

  return obj;
}
