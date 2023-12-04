import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../../../../Components/DisplayNameField";
import { Form } from "../../../../Components/Form";
import * as models from "../../../../models";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { BillingFeature } from "../../../../util/BillingFeature";
import FormikAutoSave from "../../../../util/formikAutoSave";
import { FeatureControlContainer } from "../../../../Components/FeatureControlContainer";

type Props = {
  onSubmit: (values: models.GitRepository) => void;
  defaultValues?: models.GitRepository;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "gitOrganization",
  "groupName",
  "name",
];

export const INITIAL_VALUES: Partial<models.GitRepository> = {
  baseBranchName: "",
};

const RepositoryForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.GitRepository;
  }, [defaultValues]);

  return (
    <FeatureControlContainer
      featureId={BillingFeature.ChangeGitBaseBranch}
      entitlementType="boolean"
      render={({ icon, disabled: featureDisabled }) => (
        <>
          <FlexItem
            margin={EnumFlexItemMargin.Both}
            gap={EnumGapSize.Small}
            direction={EnumFlexDirection.Column}
          >
            <FlexItem>
              <Text textStyle={EnumTextStyle.H4}>Git Base Branch</Text>
              <Icon icon={icon} size="xsmall" color={EnumTextColor.Black20} />
            </FlexItem>
            <Text textStyle={EnumTextStyle.Description}>
              Override the default base branch used for the Pull Request with
              the generated code
            </Text>
          </FlexItem>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSubmit}
          >
            <Form childrenAsBlocks>
              <FormikAutoSave debounceMS={1000} />

              <FlexItem>
                <DisplayNameField
                  labelType="normal"
                  disabled={featureDisabled}
                  name="baseBranchName"
                  label="Base Branch"
                  inputToolTip={{
                    content: (
                      <span>
                        Leave this field empty to use the default branch of the
                        repository
                      </span>
                    ),
                  }}
                  minLength={1}
                />
              </FlexItem>
            </Form>
          </Formik>
        </>
      )}
    />
  );
};

export default RepositoryForm;
