import { Button, Dialog, Flex, Typography } from '@strapi/design-system';
import { Plus, Trash, WarningCircle } from '@strapi/icons';
import { useState } from 'react';
import type { RepoData } from '../types';

interface BulkActionsProps {
  selectedRepos: RepoData[];
  onBulkCreate: (repos: RepoData[]) => Promise<void>;
  onBulkDelete: (repos: RepoData[]) => Promise<void>;
}

const BulkActions = ({ selectedRepos, onBulkCreate, onBulkDelete }: BulkActionsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (selectedRepos.length === 0) return null;

  const creatable = selectedRepos.filter((repo) => !repo.projectId);
  const deletable = selectedRepos.filter((repo) => repo.projectId);

  const handleBulkCreate = async () => {
    setIsCreating(true);
    await onBulkCreate(creatable);
    setIsCreating(false);
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    await onBulkDelete(deletable);
    setIsDeleting(false);
  };

  return (
    <Flex
      gap={4}
      padding={4}
      background="neutral0"
      justifyContent="space-between"
      hasRadius
      shadow="tableShadow"
      marginBottom={4}
    >
      <Typography variant="omega">{selectedRepos.length} selected</Typography>
      <Flex gap={2}>
        <Button
          startIcon={<Plus />}
          variant="secondary"
          onClick={handleBulkCreate}
          loading={isCreating}
          disabled={creatable.length === 0}
        >
          Create {creatable.length} project{creatable.length === 1 ? '' : 's'}
        </Button>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button startIcon={<Trash />} variant="danger-light" disabled={deletable.length === 0}>
              Delete {deletable.length} project{deletable.length === 1 ? '' : 's'}
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>Confirm deletion</Dialog.Header>
            <Dialog.Body icon={<WarningCircle fill="danger600" />}>
              Are you sure you want to delete {deletable.length} project{deletable.length === 1 ? '' : 's'}? This
              action cannot be undone.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Cancel>
                <Button variant="tertiary">Cancel</Button>
              </Dialog.Cancel>
              <Dialog.Action>
                <Button variant="danger" loading={isDeleting} onClick={handleBulkDelete}>
                  Delete
                </Button>
              </Dialog.Action>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Flex>
  );
};

export default BulkActions;
